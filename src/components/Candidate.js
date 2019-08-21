import React from "react";
import { Box, Text, Button } from "grommet";

const Candidate = props => {
  return (
    <Box
      flex={false}
      background="white"
      padding="small"
      margin={{ top: "medium" }}
      elevation="medium"
      width="48rem"
      round="medium"
      border={{ size: 'xxsmall', color: 'border' }}
      align='center' justify='evenly' direction='row'
    >
      <Box pad="small">
        <img
          alt="candidate"
          src={require("../assets/profile.jpg")}
          style={{ height: 100, width: 100, borderRadius: 8 }}
        />
      </Box>
      <Box>
        <Text weight="bold">{props.name}</Text>
        <Text>Political Party: {props.party}</Text>
      </Box>
      <Box>
        <Button
          label="Vote"
          onClick={() => props.onVoteButtonPressed(props.candidateAddress)}
          primary
          hoverIndicator="background"
        />
      </Box>
    </Box>
  );
}

export default Candidate