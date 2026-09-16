const BASE = 'https://api.themoviedb.org/3'
export type TMDBMovie = { id:number; title:string; release_date?:string; poster_path?:string|null; backdrop_path?:string|null; overview?:string }
function headers(){ return { Authorization:`Bearer ${process.env.TMDB_ACCESS_TOKEN}`, accept:'application/json' } }
export async function searchMovies(query:string){
  if(!process.env.TMDB_ACCESS_TOKEN) throw new Error('TMDB_ACCESS_TOKEN is missing')
  const r=await fetch(`${BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,{headers:headers(),next:{revalidate:300}})
  if(!r.ok) throw new Error(`TMDB search failed: ${r.status}`)
  return (await r.json()).results as TMDBMovie[]
}
export async function getMovie(id:number){
  const r=await fetch(`${BASE}/movie/${id}?language=en-US`,{headers:headers(),next:{revalidate:3600}})
  if(!r.ok) return null
  return await r.json() as TMDBMovie
}
export function poster(path?:string|null){ return path ? `https://image.tmdb.org/t/p/w500${path}` : null }
export function slugify(title:string){ return title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') }
