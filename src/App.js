import React from "react";
import { Grommet, Box, Button, Heading } from "grommet";
import CandidateRegistration from "./screens/CandidateRegistration";
import VoterRegistration from "./screens/VoterRegistration";
import VotingScreen from "./screens/VotingScreen";
import getWeb3 from "./networkutils/getWeb3";
import Elections from "./builds/Elections.json";

const theme = {
  global: {
    font: {
      family: "Lato",
      size: "14px",
      height: "20px"
    }
  }
};

class App extends React.Component {
  state = {
    showCandidateRegistration: false,
    showVoterRegistration: false,
    showVotingScreen: false,
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Elections.networks[networkId];
      const instance = new web3.eth.Contract(
        Elections.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({ web3, accounts, contract: instance });
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    if(this.state.web3 === null) {
      return (
        <Grommet theme={theme} full>
          <Box fill align="center" justify="center">
            <Heading>Loading Web3, Accounts, Contract... 🧭🔨⚙️</Heading>
          </Box>
        </Grommet>
      );
    }
    if(this.state.showCandidateRegistration) {
      return (
        <CandidateRegistration/>
      );
    } else if(this.state.showVoterRegistration) {
      return (
      <VoterRegistration/>
      );
    } else if(this.state.showVotingScreen) {
      return (
        <VotingScreen
          ElectionContract={this.state.contract}
          accounts={this.state.accounts}
        />
      );
    }
    return (
      <Grommet theme={theme} full>
        <Box fill align="center" justify="center">
          <Box>
            <Heading level={2}>Let's get started!</Heading>
          </Box>
          <Box margin="small" direction="row">
            <Box pad="small">
              <Button
                label="Candidate Registration"
                primary
                hoverIndicator="background"
                onClick={() => this.setState({ showCandidateRegistration: true })}
              />
            </Box>
            <Box pad="small">
              <Button
                label="Voter Registration"
                primary
                hoverIndicator="background"
                onClick={() => this.setState({ showVoterRegistration: true })}
              />
            </Box>
          </Box>
          <Box>
            <Box pad="small">
              <Button
                label="Vote for a candidate"
                primary
                hoverIndicator="background"
                onClick={() => this.setState({ showVotingScreen: true })}
              />
            </Box>
          </Box>
        </Box>
      </Grommet>
    );
  }
}

export default App;

