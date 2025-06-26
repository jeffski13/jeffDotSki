import { ElementType } from './ElementType';

export const getTypeColor = (type: ElementType): string => {
  const typeColors: Record<ElementType, string> = {
    [ElementType.Normal]: '#A8A77A',
    [ElementType.Fire]: '#EE8130',
    [ElementType.Water]: '#6390F0',
    [ElementType.Electric]: '#ba9b1e',
    [ElementType.Grass]: '#7AC74C',
    [ElementType.Ice]: '#96D9D6',
    [ElementType.Fighting]: '#C22E28',
    [ElementType.Poison]: '#A33EA1',
    [ElementType.Ground]: '#E2BF65',
    [ElementType.Flying]: '#A98FF3',
    [ElementType.Psychic]: '#F95587',
    [ElementType.Bug]: '#A6B91A',
    [ElementType.Rock]: '#B6A136',
    [ElementType.Ghost]: '#735797',
    [ElementType.Dragon]: '#6F35FC',
    [ElementType.Dark]: '#705746',
    [ElementType.Steel]: '#B7B7CE',
    [ElementType.Fairy]: '#D685AD',
  };

  return typeColors[type] || '#000'; // Default to black if type is not found
};