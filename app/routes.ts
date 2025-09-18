import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    index("titlePage/route.tsx"),
    route(ROUTES.aboutMe.bio, "aboutMe/bio/route.tsx"),
    route(ROUTES.aboutMe.drawing, "aboutMe/hobbies/drawings/route.tsx"),
    route(ROUTES.aboutMe.tvShows, "aboutMe/hobbies/tvShows/route.tsx"),
    
    route(ROUTES.pokePeru.battle, "Pokeperu/routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokedex, "Pokeperu/routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "Pokeperu/routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "Pokeperu/routes/pokeperuinfo.tsx"),
    
    route(ROUTES.pokePeru.pokeClaremore, "Pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremore.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreDex, "Pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremoreDex.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreGym, "Pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremoreGym.tsx"),
] satisfies RouteConfig;