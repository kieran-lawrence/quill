import styled from 'styled-components'
import { QuillLogo } from '../QuillLogo'
import { IoLogOutOutline, IoChatbox } from 'react-icons/io5'
import { IconContext } from 'react-icons'
import { IconWithText } from '../shared/IconWithText'

export const Sidebar = () => {
    return (
        <IconContext.Provider value={{ className: 'sidebarIcons' }}>
            <SSidebar>
                <QuillLogo />
                <SChatGroups>
                    <IconWithText
                        icon={<IoChatbox />}
                        text={'Chats'}
                        onClick={() => {
                            console.log('Clicked')
                            //TODO: Handle click of chats
                        }}
                    />
                </SChatGroups>
                <SLogout>
                    <IconWithText
                        icon={<IoLogOutOutline />}
                        text={'Log Out'}
                        onClick={() => {
                            console.log('Logging out')
                            //TODO: Handle logout
                        }}
                    />
                </SLogout>
            </SSidebar>
        </IconContext.Provider>
    )
}
const SSidebar = styled.aside`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    min-width: 4rem;
    width: 4rem;
    height: 100%;
    padding: 2rem 1rem 2rem 0;
    box-sizing: border-box;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text.light};
`
const SChatGroups = styled.div`
    flex: 1;
`
const SLogout = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;

    .sidebarIcons {
        width: 28px;
        height: 28px;
    }
`
