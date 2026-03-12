import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET — Load settings (optionally filtered by key prefix)
export async function GET(req: NextRequest) {
  try {
    const prefix = req.nextUrl.searchParams.get('prefix');

    let settings;
    if (prefix) {
      const prefixes = prefix.split(',').map(p => p.trim());
      settings = await prisma.setting.findMany({
        where: { OR: prefixes.map(p => ({ key: { startsWith: p } })) },
      });
    } else {
      settings = await prisma.setting.findMany();
    }

    // Return as key-value map
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    return NextResponse.json({ settings: map });
  } catch (err) {
    console.error('Error loading settings:', err);
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

// PUT — Save settings (batch upsert)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Settings object required' }, { status: 400 });
    }

    // Upsert each key-value pair
    for (const [key, value] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
