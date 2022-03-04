import QRCode from 'qrcode';
import { useEffect, useState } from 'react'
import { Payload } from '../models/pix/Payload';

function Qrcode(){
    const [ src, setSrc ] = useState('')

    useEffect(() => {

        let payload = new Payload({
            pixKey: "key",
            paymentDescription: "description",
            merchantName: "merchant name",
            merchantCity: "merchant city",
            txId: "txtid",
            amount: "100.00"
        })

        let cod = payload.getPayload()

        QRCode.toDataURL(cod).then((data: any) => {
            setSrc(data)
        })
    }, [])

    return(
        <div>
            <img src={ src } />
        </div>
    )
}

export default Qrcode;