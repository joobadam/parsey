import { supabaseServer } from "@/lib/supabase-server";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseServer.from("categories").select("*").eq("user_id", session.user.id).order("name");

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

