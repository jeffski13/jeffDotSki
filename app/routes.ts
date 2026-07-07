import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    index("homePage/route.tsx"),
   
    route(ROUTES.sitemap, "sitemap/route.tsx"),
   
    route(ROUTES.techPortfolio, "aboutMeSection/techPortfolio/route.tsx"),
    route(ROUTES.teacherPortfolio, "aboutMeSection/teacherPortfolio/route.tsx"),
    
    route(ROUTES.pokePeru.battle, "teaching/pokePeruApp/routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokedex, "teaching/pokePeruApp/routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "teaching/pokePeruApp/routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "teaching/pokePeruApp/routes/pokeperuinfo.tsx"),
    
    route(ROUTES.pokePeru.extendedUniverse.claremore.battle, "teaching/pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverse.tsx"),
    route(ROUTES.pokePeru.extendedUniverse.claremore.dex, "teaching/pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverseDex.tsx"),
    route(ROUTES.pokePeru.extendedUniverse.claremore.gym, "teaching/pokePeruApp/pokeperuExtendedUniverse/claremore/routes/pokeperuExtendedUniverseGym.tsx"),
    
    route(ROUTES.pokePeru.extendedUniverse.southCarolina.battle, "teaching/pokePeruApp/pokeperuExtendedUniverse/southCarolina/routes/pokeperuExtendedUniverse.tsx"),
    route(ROUTES.pokePeru.extendedUniverse.southCarolina.dex, "teaching/pokePeruApp/pokeperuExtendedUniverse/southCarolina/routes/pokeperuExtendedUniverseDex.tsx"),
    route(ROUTES.pokePeru.extendedUniverse.southCarolina.gym, "teaching/pokePeruApp/pokeperuExtendedUniverse/southCarolina/routes/pokeperuExtendedUniverseGym.tsx"),
    
    route(ROUTES.japanese.japaneseReadings, "japanese/readingsNihonDe/route.tsx"),
    route(ROUTES.japanese.japanesePracticeLyrics, "japanese/practiceNihongoLyrics/route.tsx"),
    route(ROUTES.japanese.japaneseMusicCovers, "japanese/japaneseMusicCovers/route.tsx"),
    route(ROUTES.japanese.japaneseParenthesesToFurigana, "japanese/nihonParenthesesToFurigana/route.tsx"),
    
    route(ROUTES.aboutMe.drawing, "aboutMeSection/hobbies/drawings/route.tsx"),
    route(ROUTES.aboutMe.tvShows, "aboutMeSection/hobbies/tvShows/route.tsx"),
    route(ROUTES.aboutMe.bio, "aboutMeSection/bio/route.tsx"),
] satisfies RouteConfig;