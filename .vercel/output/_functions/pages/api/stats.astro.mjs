import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const views = 999;
const likes = 666;
const localStats = {
  views,
  likes,
};

const supabaseUrl = "https://vljgneamkzqptnxsoimu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsamduZWFta3pxcHRueHNvaW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NTMwNDcsImV4cCI6MjA4MzEyOTA0N30.1sZWyZ2uLOIHD-w3P5_cr3tGLpSmt2BNRLXwzXBcaeU";
let supabase = null;
{
  supabase = createClient(supabaseUrl, supabaseKey);
}
function log(message) {
}
const getStats = async () => {
  if (!supabase) {
    return localStats;
  }
  try {
    const { data, error } = await supabase.from("page_stats").select("views, likes").eq("slug", "home").single();
    if (error) throw error;
    log("[PROD] Stats dari Supabase");
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal ambil stats: ${e.message}. Pakai data lokal.`);
    return localStats;
  }
};
const incrementViews = async () => {
  if (!supabase) return localStats;
  try {
    const current = await getStats();
    const { data, error } = await supabase.from("page_stats").update({ views: current.views + 1 }).eq("slug", "home").select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update views: ${e.message}. Return lokal.`);
    return localStats;
  }
};
const incrementLikes = async () => {
  if (!supabase) return localStats;
  try {
    const current = await getStats();
    const { data, error } = await supabase.from("page_stats").update({ likes: current.likes + 1 }).eq("slug", "home").select().single();
    if (error) throw error;
    return data;
  } catch (e) {
    log(`[FALLBACK] Gagal update likes: ${e.message}. Return lokal.`);
    return localStats;
  }
};

const prerender = false; // Wajib server-side

async function GET() {
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

async function POST({ request }) {
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
