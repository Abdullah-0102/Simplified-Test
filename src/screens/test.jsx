const askForPermissions = (permission) => {
    request(permission).then(result => {
      console.log(result);
    });
  };

  import {request, PERMISSIONS} from 'react-native-permissions';


//   <TouchableOpacity style={styles.card} onPress={() => {
//     if (Platform.OS == 'ios') {
//       askForPermissions(PERMISSIONS.IOS.PHOTO_LIBRARY);
//     }
//     else {
//       askForPermissions(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
//     }
//   }}>