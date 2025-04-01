export const formatSDGLink = (input: string): string => {
  return input.replace(/<|>/g, '');
};