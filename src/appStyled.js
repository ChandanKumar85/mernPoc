import styled from "styled-components";
export const ChatBoat = styled.div`
    h1 { color: red; }
`;

export const ButtonWrapper = styled.div`
    width: 100%;
    padding: 15px 0;
    display: grid;
    button {
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) => props.theme.social.facebook.color};
        color: ${(props) => props.theme.social.facebook.color};
        background: ${(props) => props.theme.common.white};
        border-radius: 50px;
        padding:10px 35px;
        display: flex;
        gap: 8px;
        align-items: center;
        svg {
            max-width: 18px;
        }
        &:hover {
            border-color: ${(props) => props.theme.common.white};
            color: ${(props) => props.theme.common.white};
            background: ${(props) => props.theme.social.facebook.color};
        }
    }
`;