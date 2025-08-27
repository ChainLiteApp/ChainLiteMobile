import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StatusBar, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from '../constants/Colors';

export default function CustomStatusBar() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  
  // For Android, we'll use React Native's StatusBar
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setTranslucent(true);
      StatusBar.setBarStyle('light-content');
    }
  }, []);

  // For iOS, we'll use Expo's StatusBar
  if (Platform.OS === 'ios') {
    return (
      <ExpoStatusBar 
        style="light"
        backgroundColor="transparent"
        translucent
      />
    );
  }

  // For Android, we don't need to render anything as we're using the StatusBar API
  return null;
}
