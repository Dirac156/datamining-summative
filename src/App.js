import './App.css';
import RouterComponent from './Router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <RouterComponent />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
