import Editor from '@monaco-editor/react';
import { Box, Button, Tab, Tabs } from '@mui/material';
import SelectComponent from './SelectComponent';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../App';
import repository from '../repository/repository';
import { transformToSelectItems } from './utility';
import InputComponent from './InputComponent';
import ModalProblemSubmissions from './ModalProblemSubmissions';

export default function CodeEditor(props) {
  const { problemId } = useParams();
  const ctx = useContext(AppContext);

  const languages = ['cpp', 'c', 'javascript', 'java'];
  const [responseOutput, setResponseOutput] = useState('');
  const [code, setCode] = useState('');

  const [newSubmission, setNewSubmission] = useState(true);
  const [obj, setObj] = useState({
    language: ctx.useLanguage,
    theme: 'vs-light',
    input: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (obj.language === '') {
      return;
    }
    repository
      .createSubmission({
        userId: ctx.userDetails?.email,
        problemId,
        language: obj.language,
        code,
      })
      .then((res) => {
        setNewSubmission(true);
        setResponseOutput(res.output);
      });
  };

  const handleRun = (event) => {
    event.preventDefault();
    repository
      .runCode({
        fileName: ctx.userDetails?.email,
        problemId,
        language: obj.language,
        code,
        input: obj.input,
      })
      .then((data) => setResponseOutput(data.output));
  };

  useEffect(() => {
    setCode(ctx.useCode || props.problem.starterCode);
  }, [ctx.useCode, props.problem]);

  useEffect(() => {
    setObj({ ...obj, language: ctx.useLanguage });
  }, [ctx.useLanguage]);

  return (
    <Box
      sx={{
        height: props.height || 'auto',
        width: props.width || 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: { xs: 'block', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Tabs
          sx={{ width: '100%' }}
          onChange={(event, newTheme) => setObj({ ...obj, theme: newTheme })}
          value={obj.theme}
        >
          <Tab sx={{ width: '50%' }} value="vs-light" label={'Light'} />
          <Tab sx={{ width: '50%' }} value="vs-dark" label={'Dark'} />
        </Tabs>
        <SelectComponent
          selectItems={transformToSelectItems(languages, languages)}
          obj={obj}
          setObj={setObj}
          attr={'language'}
          variant="standard"
          width="100%"
        ></SelectComponent>
      </Box>
      <Editor
        theme={obj.theme}
        language={obj.language}
        value={code}
        height={'100%'}
        width={'100%'}
        onChange={(code) => setCode(code)}
        options={{
          automaticLayout: true,
          selectOnLineNumbers: true,
          cursorStyle: 'line',
          minimap: { enabled: false },
        }}
      ></Editor>
      <form
        onSubmit={handleRun}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <InputComponent
          obj={obj}
          setObj={setObj}
          attr={'input'}
          multiline
          rows={3}
          required
        ></InputComponent>
        <code>
          Output:
          {responseOutput}
        </code>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <ModalProblemSubmissions
            problemId={problemId}
            newSubmission={newSubmission}
            setNewSubmission={setNewSubmission}
          ></ModalProblemSubmissions>
          <Button type={'submit'}>Run</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </Box>
      </form>
    </Box>
  );
}
