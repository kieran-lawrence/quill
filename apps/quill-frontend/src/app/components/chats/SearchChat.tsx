import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import styled from 'styled-components'
import { useDebounce } from '../../utils/hooks'
import { searchGroupMessages, searchPrivateMessages } from '../../utils/api'
import { GroupMessage, PrivateMessage } from '@quill/data'
import { useAuth } from '../../contexts/auth'
import { ChatMessage } from './ChatMessage'
import { LoadingSpinner } from '../LoadingSpinner'

type Props = {
    isVisible: boolean
    chatId: number
    isGroupChat: boolean
}

export const SearchChat = ({ isVisible, chatId, isGroupChat }: Props) => {
    const [query, setQuery] = useState('')
    const [messages, setMessages] = useState<GroupMessage[] | PrivateMessage[]>(
        [],
    )
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const onSearch = (query: string) => {
        if (!query) return
        isGroupChat
            ? searchGroupMessages({ groupId: chatId, query }).then((res) => {
                  if (res.length > 0) {
                      setMessages(res)
                  }
                  setLoading(false)
              })
            : searchPrivateMessages({ chatId, query }).then((res) => {
                  if (res.length > 0) {
                      setMessages(res)
                  }
                  setLoading(false)
              })
    }
    const debouncedSearch = useDebounce(onSearch, 500)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        debouncedSearch(e.target.value)
        setLoading(true)
        // Reset message state if input is empty
        if (!e.target.value) {
            setLoading(false)
            setTimeout(() => {
                setMessages([])
            }, 250)
        }
    }

    return (
        <SSearchChatWrapper $isVisible={isVisible}>
            <SSearchWindow $isVisible={isVisible}>
                <h3>Search this chat</h3>
                <SSearchInput>
                    <IoSearch size={26} />
                    <input
                        placeholder="Search"
                        tabIndex={0}
                        value={query}
                        onChange={handleChange}
                    />
                </SSearchInput>
                {messages.length > 0 ? (
                    <>
                        <h4>
                            Showing {messages.length}{' '}
                            {messages.length === 1 ? 'message' : 'messages'}
                        </h4>
                        <SSearchResults>
                            {messages.map((message) => (
                                <SChatBox
                                    $isAuthor={user?.id === message.author.id}
                                    key={message.id}
                                >
                                    <ChatMessage
                                        message={message}
                                        isAuthor={
                                            user?.id === message.author.id
                                        }
                                        isEditing={false}
                                    />
                                </SChatBox>
                            ))}
                        </SSearchResults>
                    </>
                ) : query ? (
                    loading ? (
                        <SLoadingWrapper>
                            <LoadingSpinner /> <em>Searching</em>
                        </SLoadingWrapper>
                    ) : (
                        <h4>No results found</h4>
                    )
                ) : (
                    <h4>Start typing to see results</h4>
                )}
            </SSearchWindow>
        </SSearchChatWrapper>
    )
}

const SSearchChatWrapper = styled.aside<{ $isVisible: boolean }>`
    margin-left: ${(props) => (props.$isVisible ? '0.5rem' : '0')};
    display: flex;
    flex-direction: column;
    height: 100%;
    width: ${(props) => (props.$isVisible ? '18vw' : '0')};
    transition: all 0.2s;
    h3 {
        font-size: 1.1rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }
`
const SSearchWindow = styled.div<{ $isVisible: boolean }>`
    background: ${({ theme }) => theme.colors.backgroundPrimary};
    opacity: ${(props) => (props.$isVisible ? '1' : '0')};
    padding: 1rem;
    box-sizing: border-box;
    transition: all 0.2s;
    border-radius: 0.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    h4 {
        font-size: 0.9rem;
        font-weight: 500;
        margin: 1rem 0 0.1rem 0;
        border-bottom: ${({ theme }) => `1px solid ${theme.colors.shadow}`};
    }
`
const SSearchInput = styled.div`
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.blueAccent};
    border-radius: 0.5rem;
    padding: 0.5rem;
    gap: 0.5rem;
    outline: ${({ theme }) => `1px solid ${theme.colors.blueAccent}`};
    transition: all 0.2s;
    input {
        border: none;
        background: none;
        outline: none;
        font-size: 1.1rem;
        width: 100%;
        box-sizing: border-box;
    }

    &:is(:hover, :active, :focus-within) {
        outline: ${({ theme }) => `1px solid ${theme.colors.blueStrong}`};
        cursor: text;
    }
`
const SSearchResults = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    padding: 1rem 0;
    overflow-y: scroll;
    flex: 1;
    box-sizing: border-box;
`
const SChatBox = styled.address<{ $isAuthor: boolean }>`
    display: flex;
    align-items: flex-end;
    flex-direction: ${({ $isAuthor }) => ($isAuthor ? 'row-reverse' : 'row')};
    align-self: ${({ $isAuthor }) => ($isAuthor ? 'flex-end' : 'flex-start')};
    gap: 0.5rem;
    width: fit-content;
    max-width: 95%;
    font-style: normal;
`
const SLoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    margin: 1rem 0 0.1rem 0;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.shadow}`};
    em {
        font-size: 0.9rem;
    }
`
