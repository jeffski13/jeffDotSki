import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    index("TitlePage/route.tsx"),
    route(ROUTES.aboutMe.bio, "aboutMe/bio/route.tsx"),
    route(ROUTES.aboutMe.drawing, "aboutMe/hobbies/drawings/route.tsx"),
    route(ROUTES.aboutMe.tvShows, "aboutMe/hobbies/tvShows/route.tsx"),
    
    route(ROUTES.pokePeru.battle, "pokeperu/routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokedex, "pokeperu/routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "pokeperu/routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "pokeperu/routes/pokeperuinfo.tsx"),
    
    route(ROUTES.pokePeru.pokeClaremore, "pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremore.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreDex, "pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremoreDex.tsx"),
    route(ROUTES.pokePeru.pokeClaremoreGym, "pokeperu/pokeperuExtendedUniverse/routes/pokeperuClaremoreGym.tsx"),
] satisfies RouteConfig;