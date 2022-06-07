export interface IMessage {
    id:string
    text:string
    uid:string
    photoURL:string | null
    createdAt:firebase.firestore.Timestamp
    displayName:string | null
    unread:boolean
    system:boolean
}
