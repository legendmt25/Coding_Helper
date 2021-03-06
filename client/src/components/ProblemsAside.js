import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import repository from '../repository/repository';
import { shadow } from './styles';

export default function ProblemsAside() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    repository.findTop10Problems().then((res) => setProblems(res));
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        boxShadow: shadow,
        borderRadius: 1,
      }}
    >
      <Typography
        variant={'h6'}
        component={'p'}
        sx={{ backgroundColor: 'white', py: 1, borderRadius: 1 }}
      >
        Top liked problems
      </Typography>
      {problems.map((problem, index) => (
        <Link
          key={index}
          to={`/problem/${problem.problem.id}`}
          style={{
            color: 'black',
            textDecoration: 'none',
          }}
        >
          <Box
            key={problem.id}
            sx={{
              p: 2,
              px: 10,
              transition: 'all',
              transitionDuration: '200ms',
              display: 'flex',
              ':hover': {
                color: 'blue',
                backgroundColor: 'whitesmoke',
              },
            }}
          >
            <Box sx={{ flex: '0 1 10%' }}>{index + 1}</Box>
            <Box sx={{ flex: '0 1 80%' }}>{problem.problem.title}</Box>
            <Box sx={{ flex: '0 1 10%' }}>{problem.likes}</Box>
          </Box>
        </Link>
      ))}
    </Box>
  );
}
