import TenetExperience from './components/TenetExperience';
import { ErrorBoundary } from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <TenetExperience />
    </ErrorBoundary>
  );
}

export default App;
