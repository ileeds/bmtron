import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

const isOnTeam = (teams, myColor, selected) => {
  if (selected && !isEmpty(teams)) {
    const myTeam = find(teams, team => team.includes(selected));
    return includes(myTeam, myColor);
  }
  return false;
};

export {
  isOnTeam,
};
