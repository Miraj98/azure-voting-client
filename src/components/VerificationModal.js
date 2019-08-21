import React from "react";
import { Box, Heading, Button } from "grommet";
import SyncLoader from "react-spinners/SyncLoader";

const VerificationModal = props => {
  return (
    <Box
      pad="large"
      justify="center"
      align="center"
      gap="medium"
    >
      <Heading level={2}>Scan QR with uPort App</Heading>
      <img alt="fetching qr code" src={props.qr} style={{ height: 250, width: 250, marginBottom: 12 }} />
      <SyncLoader
        size={10}
        sizeUnit="px"
        loading={props.otpstate !== "not-started" && props.otpstate !== "done"}
        color="#6200ea"
      />
      {
        props.otpstate === "done" ? (
          <Button
            label="Register your vote on blockchain"
            primary
            hoverIndicator="background"
            onClick={() => props.registerVoteOnBlockchain(props.candidateWalletAddressSelected, props.voterAddress)}
          />
        ) : null
      }
    </Box>
  );
}

export default VerificationModal;