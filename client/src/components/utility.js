export const transformToSelectItems = (list) => {
  return list.map((el, index) => {
    return {
      text: el,
      value: index,
    };
  });
};

export const capitalize = (str) => {
  return (
    str[0].toUpperCase() +
    str
      .slice(1)
      .split('')
      .map((x) => (x.toUpperCase() === x ? ` ${x.toLowerCase()}` : x))
      .join('')
  );
};

export const difficultyColor = (difficulty) => {
  if (difficulty === 'EASY') return 'green';
  if (difficulty === 'MEDIUM') return 'orange';
  return 'red';
};
