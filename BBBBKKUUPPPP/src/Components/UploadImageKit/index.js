import React from 'react';
import { IKContext, IKUpload } from 'imagekitio-react'

function App(props) {
    const { onChange } = props;
    const publicKey = `${process.env.REACT_APP_PUBLICKEY}`;
    let urlEndpoint = `${process.env.REACT_APP_URLENDPOINT}`;

    const authenticator = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}auth-api/upload-auth`);
            const data = await response?.json()
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    const onError = (err) => {
        console.log("Error", err);
    };

    const onSuccess = (res) => {
        console.log("Success", res);
        if (res?.url) {
            onChange(res.url)
        }
    };


    return (
        <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >

            <IKUpload
                fileName="test-upload.png"
                onError={onError}
                onSuccess={onSuccess}
            />
        </IKContext>
    );
}

export default App;