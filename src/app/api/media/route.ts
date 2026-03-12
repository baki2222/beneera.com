import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import prisma from '@/lib/prisma';

const BUCKET = 'media';
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed. Accepted: JPEG, PNG, WebP, GIF, SVG.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = file.name.split('.').pop() || 'jpg';
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .substring(0, 50);
    const path = `uploads/${timestamp}-${safeName}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path) return NextResponse.json({ error: 'No path provided' }, { status: 400 });

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const include = req.nextUrl.searchParams.get('include') || 'all';

    const allFiles: any[] = [];

    // Get product images from the database
    if (include === 'all' || include === 'product') {
      const products = await prisma.product.findMany({
        select: { id: true, title: true, images: true },
        where: { published: true },
        orderBy: { title: 'asc' },
      });

      const seen = new Set<string>();
      for (const product of products) {
        for (let i = 0; i < product.images.length; i++) {
          const imgPath = product.images[i];
          if (seen.has(imgPath)) continue;
          seen.add(imgPath);
          const fileName = imgPath.split('/').pop() || '';
          allFiles.push({
            id: `product-${product.id}-${i}`,
            name: fileName,
            url: imgPath, // relative path like /images/products/foo-1.jpg
            path: imgPath,
            size: 0,
            type: 'image/jpeg',
            source: 'product',
            productTitle: product.title,
          });
        }
      }
    }

    // Get uploaded files from Supabase Storage
    if (include === 'all' || include === 'upload') {
      const { data, error } = await supabase.storage.from(BUCKET).list('uploads', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data) {
        for (const f of data) {
          if (f.name === '.emptyFolderPlaceholder') continue;
          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(`uploads/${f.name}`);
          allFiles.push({
            id: f.id,
            name: f.name,
            url: urlData.publicUrl,
            path: `uploads/${f.name}`,
            size: f.metadata?.size || 0,
            type: f.metadata?.mimetype || 'image/jpeg',
            source: 'upload',
            createdAt: f.created_at,
          });
        }
      }
    }

    return NextResponse.json({ files: allFiles });
  } catch (err) {
    console.error('List error:', err);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
