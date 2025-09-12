import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    index("routes/jeffskihome.tsx"),
    route(ROUTES.aboutMe.bio, "routes/aboutMeBio.tsx"),
    route(ROUTES.aboutMe.drawing, "routes/aboutMeDrawings.tsx"),
    route(ROUTES.aboutMe.tvShows, "routes/aboutMeTvShows.tsx"),
    route(ROUTES.pokePeru.battle, "routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokeClaremore, "routes/pokeperuClaremore.tsx"),
    route(ROUTES.pokePeru.pokedex, "routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "routes/pokeperuinfo.tsx"),
] satisfies RouteConfig;