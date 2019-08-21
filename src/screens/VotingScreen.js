import React from "react";
import { Grommet, Box, Layer, Heading, InfiniteScroll, Text } from "grommet";
import Appbar from "../components/Appbar";
import VerificationModal from "../components/VerificationModal";
import { fetchVerificationQrCode, fetchGenerateOtpState } from "../networkutils/networkrequests";
import Candidate from "../components/Candidate";
import BounceLoader from "react-spinners/BounceLoader";
// import SyncLoader from "react-spinners/SyncLoader";

const theme = {
  global: {
    font: {
      family: "Lato",
      size: "14px",
      height: "20px"
    }
  }
};


class VotingScreen extends React.Component {

  state = {
    showModal: false,
    qr: null,
    otpstate: "not-started",
    otpValue: null,
    candidates: [],
    isRegistered: null,
    userConstituency: "",
    candidateWalletAddressSelected: null,
    userHasVoted: null
  }

  componentDidMount = async () => {
    // const candidates = await this.props.ElectionContract.methods.getCandidateList().call();
    const user = await this.props.ElectionContract.methods.VoterList(this.props.accounts[0]).call();
    const isRegistered = user.isRegistered
    this.setState(() => ({ isRegistered }));
    if(isRegistered) {
      // console.log("this is executed...")
      // this.setState(() => ({ isRegistered: isRegistered ? "true" : "false" }));
      this.setState(() => ({ userConstituency: user.constituency }));
      const candidates = await this.props.ElectionContract.methods.getCandidateList().call();
      console.log(candidates);
      this.setState(() => ({ candidates, userHasVoted: user.voted }));
    }
  }

  onOtpStateChange = (otpstate) => {
    const { otp, state } = otpstate
    this.setState(() => ({ otpstate: state, otpValue: otp }));
  }

  onVoteButtonPressed = async (candidateWalletAddressSelected) => {
    this.setState(() => ({ showModal: true, candidateWalletAddressSelected }));
    const { qr } = await fetchVerificationQrCode("https://aqueous-peak-76887.herokuapp.com");
    this.setState(() => ({ qr }));
    fetchGenerateOtpState("https://aqueous-peak-76887.herokuapp.com", this.onOtpStateChange);
  }

  registerVoteOnBlockchain = async (candidateAddress, voterAddress) => {
    console.log("Candidate Address: ", candidateAddress);
    console.log("Voter Address: ", voterAddress);
    const response = await this.props.ElectionContract.methods.voteForCandidate(candidateAddress, voterAddress, this.state.otpValue).send({ from: this.props.accounts[0], gasPrice: 0 });
    if(response) {
      this.setState(() => ({ showModal: false, userHasVoted: true }));
    }
  }

  render() {
    console.log(this.state.otpstate);
    if(this.state.isRegistered === false) {
      return (
        <Grommet theme={theme} full>
          <Box fill align="center" justify="center">
            <Heading>You need to register first!</Heading>
          </Box>
        </Grommet>
      )
    } else if(this.state.isRegistered === null) {
      return (
        <Grommet theme={theme} full>
          <Box fill align="center" justify="center">
            <Heading>Fetching registration details...</Heading>
          </Box>
        </Grommet>        
      )
    } else if(this.state.userHasVoted) {
      return (
        <Grommet theme={theme} full>
          <Box fill align="center" justify="center">
            <Heading>You have voted. Thank you 😄</Heading>
          </Box>
        </Grommet>
      )
    }
    return (
      <Grommet theme={theme} full>
        <Appbar header="Voting Screen" />
        <Box
          background="light-3"
          justify="start"
          align="center"
          style={{ wordWrap: "anywhere" }}
          pad="medium"
          fill
          overflow={{ vertical: "scroll" }}
        >
          <Box
            width="100%"
            direction="row"
            align="center"
          >
            <span>
              <BounceLoader
                sizeUnit="px"
                size={15}
                color="green"
                loading={true}
              />
            </span>
            <Text margin={{ left: "small" }}>Constituency: {this.state.userConstituency}</Text>
          </Box>
          <Box pad="medium">
            <Heading level={2}>Candidates in your constituency</Heading>
          </Box>
          <InfiniteScroll items={this.state.candidates.filter(candidate => candidate[1] === this.state.userConstituency)}>
            {
              (item, index) => (
                <Candidate
                  key={index}
                  name={item[0]}
                  party={item[2]}
                  candidateAddress={item[5]}
                  onVoteButtonPressed={this.onVoteButtonPressed}
                />
              )
            }
          </InfiniteScroll>
          {/* <Button
            label="Initiate voting process"
            // margin={{ top: "large" }}
            primary
            hoverIndicator="background"
            onClick={async () => {
              this.setState(() => ({ showModal: true }));
              const { qr } = await fetchVerificationQrCode("https://5b238b55.ngrok.io");
              this.setState(() => ({ qr }));
              fetchGenerateOtpState("https://5b238b55.ngrok.io", this.onOtpStateChange);
            }}
          /> */}
          {
            this.state.showModal && (
              <Layer
                onEsc={() => this.setState({ showModal: false, candidateWalletAddressSelected: null })}
                onClickOutside={() => this.setState({ showModal: false, candidateWalletAddressSelected: null })}
              >
                <VerificationModal
                  candidateWalletAddressSelected={this.state.candidateWalletAddressSelected}
                  voterAddress={this.props.accounts[0]}
                  otpstate={this.state.otpstate}
                  qr={this.state.qr}
                  registerVoteOnBlockchain={this.registerVoteOnBlockchain}
                />
              </Layer>
            )
          }
        </Box>
      </Grommet>
    );
  }
}

export default VotingScreen;