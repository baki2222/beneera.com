import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — List all inquiries
export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ inquiries });
  } catch (err) {
    console.error('Error loading inquiries:', err);
    return NextResponse.json({ error: 'Failed to load inquiries' }, { status: 500 });
  }
}

// PATCH — Update inquiry status/notes
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data,
    });

    return NextResponse.json({ inquiry });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

// DELETE — Bulk delete inquiries
export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
    }

    await prisma.inquiry.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    console.error('Error deleting inquiries:', err);
    return NextResponse.json({ error: 'Failed to delete inquiries' }, { status: 500 });
  }
}
