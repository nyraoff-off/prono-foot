import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const team = searchParams.get("team");

  if (!team || team.trim().length < 2) {
    return NextResponse.json({ matches: [] });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Cle API manquante. Ajoute API_FOOTBALL_KEY dans les variables d'environnement" },
      { status: 500 }
    );
  }

  try {
    const teamRes = await fetch(
      `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(team)}`,
      {
        headers: { "x-apisports-key": apiKey },
      }
    );
    const teamData = await teamRes.json();

    if (!teamData.response || teamData.response.length === 0) {
      return NextResponse.json({ matches: [] });
    }

    const teamIds = teamData.response.slice(0, 3).map((t) => t.team.id);

    const allMatches = [];
    for (const id of teamIds) {
      const fixturesRes = await fetch(
        `https://v3.football.api-sports.io/fixtures?team=${id}&next=5`,
        {
          headers: { "x-apisports-key": apiKey },
        }
      );
      const fixturesData = await fixturesRes.json();
      if (fixturesData.response) {
        allMatches.push(...fixturesData.response);
      }
    }

    const matches = allMatches.map((f) => ({
      id: f.fixture.id,
      home: f.teams.home.name,
      away: f.teams.away.name,
      date: new Date(f.fixture.date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      competition: f.league.name,
    }));

    return NextResponse.json({ matches });
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur lors de la recherche des matchs." },
      { status: 500 }
    );
  }
}
