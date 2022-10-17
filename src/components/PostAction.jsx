import {IonButton, IonIcon, useIonActionSheet, useIonAlert} from "@ionic/react";
  import { ellipsisHorizontalOutline } from "ionicons/icons";
  import { Toast } from "@capacitor/toast";
  


  export default function PostActions({ post, reload }) {
    const [presentActionSheet] = useIonActionSheet();
    const [presentDeleteDialog] = useIonAlert();
  
    function showActionSheet(event) {
      event.preventDefault();
      presentActionSheet({
        buttons: [
          { text: "Delete post", role: "destructive", handler: showDeleteDialog },
          { text: "Cancel", role: "cancel" },
        ],
      });
    }
  
    function showDeleteDialog() {
      presentDeleteDialog({
        header: "Delete Post",
        message: "Do you want to delete this post?",
        buttons: [
          { text: "No" },
          { text: "Yes", role: "destructive", handler: deletePost },
        ],
      });
    }
  
    // TODO: Delete post
    async function deletePost() {
       method: "DELETE",
      
      await Toast.show({
        text: "Post deleted!",
        position: "center",
        duration: "long",
      });

      console.log(response);
    }
  
    return (
      <IonButton fill="clear" onClick={showActionSheet}>
        <IonIcon slot="icon-only" icon={ellipsisHorizontalOutline} />
      </IonButton>
    );