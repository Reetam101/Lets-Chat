import { Avatar, Tooltip } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatContext } from '../context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../helpers/ChatHelpers'

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext)

  return (
    <ScrollableFeed>
      {
        messages && messages.map((m, i) => (
          <div key={m._id} style={{ display: "flex" }}>
            {
              ((isSameSender(messages, m, i, user._id)) || (isLastMessage(messages, i, user._id))) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )
            }
            <span style={{backgroundColor: `${m.sender._id === user._id ? "#D0F0C0" : "#89CFF0"}`, color: 'black', borderRadius: "16px", 
            padding: "3px 10px", 
            maxWidth: "75%", 
            marginLeft: isSameSenderMargin(messages, m, i, user._id),
            marginTop: isSameUser(messages, m, i) ? 3 : 10
            }}>
              {m.content}
            </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat