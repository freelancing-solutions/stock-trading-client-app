import 'react-perfect-scrollbar/dist/css/styles.css';
// import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';

const App = () => {
  // const routing = useRoutes(routes);

  return (
      <>
          <div >
              <h2> Pinoy Desk </h2>
          </div>
      </>
  );
};

export default App;
