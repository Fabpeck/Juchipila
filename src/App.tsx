import React from 'react';
import './App.css';
import './stylesheets/General.css';
import { Login, LoginController } from './views/loginPage/Login';
import { initializeApp } from 'firebase';
import { Registration, RegistrationController } from './views/loginPage/Registration';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { TresLechesSession } from './services/TresLechesSession';
import { Home } from './views/home/Home';
import { IconSources, Icon } from './components/Icon';
import { ConverterController, Converter } from './views/Converter/Converter';
import { KenKenPage } from './views/KenKen/KenKenPage';

var firebaseConfig = {
  apiKey: "AIzaSyC1RR_SpCmX8k0ZADiBezv9l5W51RkIe0I",
  authDomain: "juchipila-be066.firebaseapp.com",
  databaseURL: "https://juchipila-be066.firebaseio.com",
  projectId: "juchipila-be066",
  storageBucket: "juchipila-be066.appspot.com",
  messagingSenderId: "756325522741",
  appId: "1:756325522741:web:29b82ad7ff89ce7d9e807c"
};

function App() {
  initializeApp(firebaseConfig);
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <LandingView />}/>
        <Route excat path ="/home" component={() => TresLechesSession.getInstance().user ? <Home/> : <Redirect to="/"/>}/>
        <Route excat path ="/cookbook/:id" component={() => TresLechesSession.getInstance().user ? <Home/> : <Redirect to="/"/>}/>
      </Switch>
    </Router>
  );
}

@observer
export class LandingView extends React.Component {
  @observable showLogin: boolean = true;
  @observable originalIcon: boolean = true;

  converterMx = new ConverterController();
  loginBoxController: LoginController | undefined;
  registrationBoxController: RegistrationController | undefined;
  componentWillMount() {
    this.loginBoxController = new LoginController();
    this.registrationBoxController = new RegistrationController();
  }
  render() {
    return <div className="App">
      <div className="App-header">
      <button onClick={action(() => this.showLogin = !this.showLogin)}>{this.showLogin ? "Registration" : "Back To Login"}</button>
        <div>
          <div className="title">Tres Leches:</div>
          <div className="sub-title">The Collaborative Cookbook</div>
          <Icon className="logo" name={this.originalIcon ? "logoBW" : "logoV2"} onClick={action(() => this.originalIcon = !this.originalIcon)} source={IconSources.ASSETS}/>
        </div>
        <div>
          {this.showLogin ?
            <Login controller={this.loginBoxController || new LoginController()} /> :
            <Registration controller={this.registrationBoxController || new RegistrationController()} />}
        </div>
        <button onClick={() => Converter.displayDialog(this.converterMx)}>
          <Icon source={IconSources.FONTAWESOME} name="calculator"/>
        </button>
        <button onClick={() => KenKenPage.displayDialog()}>
          <Icon source={IconSources.FONTAWESOME} name="info"/>
        </button>
      </div>
    </div>
  }
}

export default App;
