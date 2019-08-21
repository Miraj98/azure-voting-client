import React from 'react';
import { Grommet, Box, TextInput, Button, Text } from 'grommet';
import Appbar from "../components/Appbar";
import { postNewCandidateRegistration } from "../networkutils/networkrequests";
import ScaleLoader from "react-spinners/ScaleLoader";

const theme = {
  global: {
    font: {
      family: "Lato",
      size: "14px",
      height: "20px"
    }
  }
};

class CandidateRegistration extends React.Component {
  state = {
    name: '',
    politicalParty: '',
    constituency: '',
    ethWalletAddr: '',
    txState: "not-started"
  }

  onTxStateChange = (state) => {
    this.setState(() => ({ txState: state }));
  }

  render() {
    return (
      <Grommet theme={theme} full>
        <Appbar header="Candidate Registration" />
        <Box flex align="center">
          <Box
            margin={{ top: "large" }}
            direction="row"
            gap="large"
          >
            <TextInput
              placeholder="Candidate name"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
            <TextInput
              placeholder="Political Party"
              value={this.state.politicalParty}
              onChange={event => this.setState({ politicalParty: event.target.value })}
            />
          </Box>
          <Box
            margin={{ top: "large" }}
            direction="row"
            gap="large"
          >
            <TextInput
              placeholder="Constituency"
              value={this.state.constituency}
              onChange={event => this.setState({ constituency: event.target.value })}
            />
            <TextInput
              placeholder="Ethereum wallet address"
              value={this.state.ethWalletAddr}
              onChange={event => this.setState({ ethWalletAddr: event.target.value })}
            />
          </Box>
          <Button
            label="Submit"
            margin={{ top: "large" }}
            disabled={this.state.txState !== "not-started"}
            primary
            hoverIndicator="background"
            onClick={async () => {
              const response = await postNewCandidateRegistration("https://aqueous-peak-76887.herokuapp.com", {
                name: this.state.name,
                constituency: this.state.constituency,
                politicalParty: this.state.politicalParty,
                walletAddress: this.state.ethWalletAddr
              }, this.onTxStateChange);
              console.log(response);
            }}
          />
          {
            this.state.txState === "started" ? (
              <Box margin="medium">
                <ScaleLoader
                  sizeUnit="px"
                  size={10}
                  loading={true}
                  color="#6200ea"
                />
              </Box>
            ) : null
          }
          {
            this.state.txState === "done" ? (
              <Box margin="medium">
                <Text weight="bold">✅ Registration successful. Refresh the page!</Text>
              </Box>
            ) : null
          }
        </Box>
      </Grommet>
    );
  }
}

export default CandidateRegistration