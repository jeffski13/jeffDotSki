const ROUTES = {
    aboutMe: {
      bio: '/aboutme/bio',
      drawing: '/aboutme/hobbies/drawing',
      tvShows: '/aboutme/hobbies/tvShows',
    },
    pokePeru: {
      battle: '/pokeperu/battle',
      pokedex: '/pokeperu/pokedex',
      gymleaders: '/pokeperu/gymleaders',
      info: '/pokeperu/info',
      extendedUniverse: {
        claremore: {
          battle: '/pokeperu/claremore/battle',
          dex: '/pokeperu/claremore/pokedex',
          gym: '/pokeperu/claremore/gymleaders',
        },
        southCarolina: {
          battle: '/pokeperu/southCarolina/battle',
          dex: '/pokeperu/southCarolina/pokedex',
          gym: '/pokeperu/southCarolina/gymleaders',
        }
      }
    },
    external: {
      instagram: 'https://www.instagram.com/jeffski13/',
      resume: {
        teacherEnglish: 'https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_TeacherEnglish_2025_10_20.pdf',
        profeIngles: 'https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_CVProfeIngles_2025_10_20_ES.pdf',
        softwareEngineer: 'https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume_2025_10_20_1PAGE.pdf',
        ingenieroDeSoftware: 'https://s3.us-east-2.amazonaws.com/jeff.ski/resume/JeffSzcinski_Resume_2025_10_20_1PAGE_ES.pdf',
      }
    }
};
export default ROUTES;