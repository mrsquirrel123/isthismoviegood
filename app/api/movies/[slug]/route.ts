import { NextResponse } from 'next/server'
import { adminSupabase } from '../../../../lib/supabase'
import { searchMovies, slugify, getMovie } from '../../../../lib/tmdb'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const db = adminSupabase()

    let { data: movie, error: movieError } = await db
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()

    if (movieError) {
      console.error('Movie lookup failed:', movieError)
      return NextResponse.json(
        { error: movieError.message },
        { status: 500 }
      )
    }

    if (!movie) {
      const q = slug.replace(/-/g, ' ')
      const hits = await searchMovies(q)

      const match = hits.find(x => slugify(x.title) === slug) || hits[0]

      if (!match) {
        return NextResponse.json(
          { error: 'Movie not found' },
          { status: 404 }
        )
      }

      const full = await getMovie(match.id)

      const row = {
        tmdb_id: match.id,
        slug: slugify(match.title),
        title: match.title,
        year: match.release_date?.slice(0, 4) || null,
        poster_path: match.poster_path || null,
        backdrop_path: match.backdrop_path || null,
        overview: full?.overview || match.overview || null,
      }

      const ins = await db
        .from('movies')
        .upsert(row, { onConflict: 'tmdb_id' })
        .select()
        .single()

      if (ins.error) {
        console.error('Movie insert failed:', ins.error)

        return NextResponse.json(
          { error: `Could not save movie: ${ins.error.message}` },
          { status: 500 }
        )
      }

      if (!ins.data) {
        return NextResponse.json(
          { error: 'Movie was not returned after insert.' },
          { status: 500 }
        )
      }

      movie = ins.data
    }

    if (!movie) {
      return NextResponse.json(
        { error: 'Movie could not be loaded.' },
        { status: 500 }
      )
    }

    const { data: v, error: summaryError } = await db
      .from('ratings_summary')
      .select('*')
      .eq('movie_id', movie.id)
      .maybeSingle()

    if (summaryError) {
      console.error('Ratings lookup failed:', summaryError)
    }

    return NextResponse.json({
      movie,
      summary: v || {
        total: 0,
        good: 0,
        bad: 0,
        percent_good: null,
      },
    })
  } catch (error) {
    console.error('Movie API error:', error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}