import { Appbar } from "react-native-paper";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

// const Header = (props: NativeStackHeaderProps | BottomTabHeaderProps)

const Header = (props: NativeStackHeaderProps | BottomTabHeaderProps) => {
  const Left = props.options.headerLeft || (() => null);
  const Right = props.options.headerRight || (() => null);

  return (
    <Appbar.Header {...props}>
      <Left canGoBack={props.navigation.canGoBack()} />
      {props.navigation.canGoBack() ? (
        <Appbar.BackAction onPress={() => props.navigation.goBack()} />
      ) : null}
      <Appbar.Content title={props.options.title} />
      <Right canGoBack={props.navigation.canGoBack()} />
    </Appbar.Header>
  );
};

export default Header;
