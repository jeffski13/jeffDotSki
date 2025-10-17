import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    index("titlePage/route.tsx"),
    route(ROUTES.aboutMe.bio, "aboutMe/bio/route.tsx"),
    route(ROUTES.aboutMe.drawing, "aboutMe/hobbies/drawings/route.tsx"),
    route(ROUTES.aboutMe.tvShows, "aboutMe/hobbies/tvShows/route.tsx"),
    
    route(ROUTES.pokePeru.battle, "pokePeruApp/routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokedex, "pokePeruApp/routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "pokePeruApp/routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "pokePeruApp/routes/pokeperuinfo.tsx"),
    
    route(ROUTES.pokePeru.pokeClaremore, "pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverse.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreDex, "pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverseDex.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreGym, "pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverseGym.tsx"),
] satisfies RouteConfig;