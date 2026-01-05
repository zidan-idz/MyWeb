export const prerender = false; // Wajib server-side

import { getStats, incrementViews, incrementLikes } from '../../lib/db';

export async function GET() {
    try {
        const stats = await getStats();
        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const body = await request.json();
        let stats;

        if (body.type === 'view') {
            stats = await incrementViews();
        } else if (body.type === 'like') {
            stats = await incrementLikes();
        } else {
            stats = await getStats();
        }

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
