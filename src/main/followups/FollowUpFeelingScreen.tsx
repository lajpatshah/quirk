import React from "react";
import { Thought } from "../../thoughts";
import { ScreenProps } from "react-navigation";
import {
  Container,
  MediumHeader,
  GhostButton,
  HintHeader,
  SubHeader,
  Row,
  IconButton,
} from "../../ui";
import Constants from "expo-constants";
import theme from "../../theme";
import { StatusBar, View } from "react-native";
import * as stats from "../../stats";
import { FOLLOW_UP_FEELING_REVIEW_SCREEN, THOUGHT_SCREEN } from "../screens";
import { get } from "lodash";
import { saveExercise } from "../../thoughtstore";
import haptic from "../../haptic";

export default class FollowUpFeelingScreen extends React.Component<
  ScreenProps,
  {
    thought?: Thought;
  }
> {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.props.navigation.addListener("willFocus", args => {
      const thought = get(args, "state.params.thought");
      this.setState({
        thought,
      });
    });
  }

  private saveCheckup = async (
    feeling: "better" | "worse" | "same"
  ): Promise<Thought> => {
    const thought = this.state.thought;
    thought.followUpCheckup = feeling;
    return saveExercise(this.state.thought);
  };

  onFeltBetter = async () => {
    stats.userFeltBetterOnFollowUp();

    haptic.selection();
    const thought = await this.saveCheckup("better");

    this.props.navigation.navigate(FOLLOW_UP_FEELING_REVIEW_SCREEN, {
      thought,
    });
  };

  onFeltTheSame = async () => {
    stats.userFeltTheSameOnFollowUp();

    haptic.selection();
    const thought = await this.saveCheckup("same");

    this.props.navigation.navigate(FOLLOW_UP_FEELING_REVIEW_SCREEN, {
      thought,
    });
  };

  onFeltWorse = async () => {
    stats.userFeltWorseOnFollowUp();

    haptic.selection();
    const thought = await this.saveCheckup("worse");

    this.props.navigation.navigate(FOLLOW_UP_FEELING_REVIEW_SCREEN, {
      thought,
    });
  };

  onClose = async () => {
    haptic.selection();
    this.props.navigation.navigate(THOUGHT_SCREEN);
  };

  render() {
    return (
      <Container
        style={{
          paddingTop: Constants.statusBarHeight + 24,
          backgroundColor: theme.lightOffwhite,
          flex: 1,
        }}
      >
        <StatusBar barStyle="dark-content" hidden={false} />

        <SubHeader
          style={{
            marginBottom: 12,
          }}
        >
          Next, let's check-in.
        </SubHeader>
        <HintHeader>How are you doing now?</HintHeader>

        <GhostButton
          title="Better than before 👍"
          width={"100%"}
          borderColor={theme.lightGray}
          textColor={theme.darkText}
          style={{
            marginBottom: 12,
            backgroundColor: "white",
          }}
          onPress={this.onFeltBetter}
        />
        <GhostButton
          title="About the same 🤷‍"
          width={"100%"}
          borderColor={theme.lightGray}
          textColor={theme.darkText}
          style={{
            marginBottom: 12,
            backgroundColor: "white",
          }}
          onPress={this.onFeltTheSame}
        />
        <GhostButton
          title="Worse than before 👎"
          width={"100%"}
          borderColor={theme.lightGray}
          textColor={theme.darkText}
          style={{
            marginBottom: 12,
            backgroundColor: "white",
          }}
          onPress={this.onFeltWorse}
        />
      </Container>
    );
  }
}
