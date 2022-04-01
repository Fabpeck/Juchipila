import React from 'react';
import { observable, action } from 'mobx';
import { Icon, IconSources } from '../components/Icon';
import { observer } from 'mobx-react';
import { KeywordsChat } from './KeywordsChat';
import { BaseProps, InventoryItem } from './GeneralMachine';

@observer
export class Chat  extends React.Component<BaseProps> {
    @observable private chatHistory: {user: boolean; message: string}[] = [{user: false, message: "Hello, How can I help you?"}];
    @observable newMessage: string = "";
    @observable messageSinceLastReponse: string = "";

    messagesRef: HTMLDivElement | null = null;

    componentDidUpdate() {
        if (this.messagesRef) {
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight + 35;
        }
    }

    componentDidMount() {
        if (this.messagesRef) {
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight + 35;
        }
    }

    render () {
        return <div className="chat-wrapper"><div className="chat-hist-wrapper" ref={(list) => {
            if (list) {
                this.messagesRef = list;
            }
        }}>
            {this.chatHistory.map((item, index) => {
                return item.user ? <div className="message from-user" key={index}>
                    {item.message}
                </div> : <div className="message from-bot" key={index}>
                    {item.message}
                </div>
            })}
            </div>
            <div className="write-message">
            <textarea value={this.newMessage} onKeyPress={(event) => {
                if (event.key === "Enter" && event.shiftKey) {
                    this.chatHistory.push({user: true, message: this.newMessage});
                    this.calculateResponse();
                    event.preventDefault();
                }
            }} onChange={action((event) => {
                this.newMessage = event.target.value
                })}/>
            <Icon source={IconSources.FONTAWESOME} className="send-button" name="paper-plane" onClick={() => {
                this.chatHistory.push({user: true, message: this.newMessage});
                this.calculateResponse();
            }}/></div>
            </div>;
    }
    
    @action
    calculateResponse(): void {
        const message = this.messageSinceLastReponse + " " + this.newMessage;
        this.messageSinceLastReponse = message;
        console.log(message);
        const parsedMessage = message.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").replace("\n", "").toLowerCase().split(" ");
        this.newMessage = "";
        if (parsedMessage.indexOf("date") > -1 || message.toLowerCase().indexOf(" exp") > -1) {
            // they are talking about dates, do they want to check or update
            if (!parsedMessage.some(word => KeywordsChat.modify.includes(word))) {
                // retrive product information: look through inventory and find the date
                let match = undefined;
                let indexInMessage = 0;
                while ((match === undefined) && (indexInMessage < parsedMessage.length)) {
                    match = this.props.parentMachine.inventory.find((item: InventoryItem) => item.name.toLowerCase() === parsedMessage[indexInMessage])
                    indexInMessage++;
                    if (match) {
                        this.chatHistory.push({user: false, message: match.name + " expires on " + match.exp})
                        this.messageSinceLastReponse = "";
                    }
                    else if (indexInMessage === parsedMessage.length) {
                        this.chatHistory.push({user: false, message: "Sorry, the product you inquired about is not in your inventory"})
                        this.messageSinceLastReponse = "";
                    }
                    console.log("while loop index " + indexInMessage + message);
                }
            }
        }
    }
}