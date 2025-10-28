# jeff.ski

Howdy! I decided it would be fun to build an opensource website. It has been a blast sipping coffee in the evenings while creating this
and doing some collaboration with my friends at work.

Feel free to look through this as examples! I did manage to get the various frameworks working together, which is always fun.

## PokePeru

This website is built with node v22.20.0. Please download the repo: https://github.com/jeffski13/jeffDotSki. Navigate to the downloaded repo in the terminal and install and start:

``` bash
npm install

npm start
```

NOTE: all folders inside of `app` should be camel cased starting with a lower case. Due to issues with casing and git and windows/unix file systems this might be a problem on install.

In the browser, go to http://localhost:5173/pokePeru/battle

For info on modifying the project with your students' monsters, please see http://localhost:5173/pokePeru/info.

### Isolating PokePeru Project

A portable version of pokeperu is available [here](https://s3.us-east-2.amazonaws.com/jeff.ski/pokeperu/pokeperuproject.zip). Download the zip, uncompress,  and in the terminal run `npm install`, `npm start`.

To create this portable version, delete the following folders:

- [aboutMe](./app/aboutMe)
- [footerBarski](./app/infra/footerBarski)
- [pokeperuExtendedUniverse](./app/pokePeruApp/pokeperuExtendedUniverse)
- [extendedUniverse](./public/images/monsters/extendedUniverse)
- [titlePage](./app/titlePage)
- [firebaseski](./firebaseski)
- [build](./build)
- [.github](./github)

Delete the following Files:

- [.dockerignore](./.dockerignore)
- [.gitignore](./.gitignore)
- [copyBuildToFirebase.cjs](./copyBuildToFirebase.cjs)
- [deployski.sh](./deployski.sh)
- [Dockerfile](./Dockerfile)
- [peru-9.jpg](./public/images/perulandscape/peru-9.jpg)
- [peru-10.jpg](./public/images/perulandscape/peru-10.jpg)
- [peru-11.jpg](./public/images/perulandscape/peru-11.jpg)
- [trainersquad01.png](./public/images/gymleaders/trainersquad01.png)
- [trainersquad02.png](./public/images/gymleaders/trainersquad02.png)
- [trainersquad03.png](./public/images/gymleaders/trainersquad03.png)

Modify the [ROUTES.ts](./app/consts/ROUTES.ts) to have the following content: 

``` js
const ROUTES = {
    pokePeru: {
      battle: '/pokeperu/battle',
      pokedex: '/pokeperu/pokedex',
      gymleaders: '/pokeperu/gymleaders',
      info: '/pokeperu/info',
    },
};
export default ROUTES;
```

Modify the [routes.ts](./app/routes.ts) to have the following content: 

``` js
import { type RouteConfig, index, route } from "@react-router/dev/routes";
import ROUTES from './consts/ROUTES';

export default [
    route(ROUTES.pokePeru.battle, "pokePeruApp/routes/pokeperubattle.tsx"),
    route(ROUTES.pokePeru.pokedex, "pokePeruApp/routes/pokeperupokedex.tsx"),
    route(ROUTES.pokePeru.gymleaders, "pokePeruApp/routes/pokeperugymleaders.tsx"),
    route(ROUTES.pokePeru.info, "pokePeruApp/routes/pokeperuinfo.tsx"),
] satisfies RouteConfig;
```

Modify the [NavigationBar.tsx](./app/infra/NavigationBar.tsx) to have the following content: 

``` js
import { Navbar, Nav } from 'react-bootstrap';
import ROUTES from '../consts/ROUTES';
import './styles.css';

export default function NavigationBar() {
    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="top" collapseOnSelect expand="sm">
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link href={ROUTES.pokePeru.battle}>Poké Peru</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
```

## Deploying

I created a script that will run the build, copying into the local Firebase directory, and deploying to the firebase servers. It has made me want to update my site more! [deployski.sh](./deployski.sh)
