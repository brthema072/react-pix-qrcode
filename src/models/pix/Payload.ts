export class Payload {
    static ID_PAYLOAD_FORMAT_INDICATOR: string = '00';
    static ID_MERCHANT_ACCOUNT_INFORMATION: string = '26';
    static ID_MERCHANT_ACCOUNT_INFORMATION_GUI: string = '00';
    static ID_MERCHANT_ACCOUNT_INFORMATION_KEY: string = '01';
    static ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION: string = '02';
    static ID_MERCHANT_CATEGORY_CODE: string = '52';
    static ID_TRANSACTION_CURRENCY: string = '53';
    static ID_TRANSACTION_AMOUNT: string = '54';
    static ID_COUNTRY_CODE: string = '58';
    static ID_MERCHANT_NAME: string = '59';
    static ID_MERCHANT_CITY: string = '60';
    static ID_ADDITIONAL_DATA_FIELD_TEMPLATE: string = '62';
    static ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID: string = '05';
    static ID_CRC16: string = '63';

    // CHAVE PIX
    private pixKey: string = ""
    // Descrição do pagamento
    private paymentDescription: string = ""
    // Nome do titular da conta
    private merchantName: string = ""
    // Cidade do titular da conta
    private merchantCity: string = ""
    // Id da transação pix
    private txId: string = ""
    // Valor da transação pix
    private amount: string = ""

    constructor({ pixKey, paymentDescription, merchantName, merchantCity, txId, amount }
        : { pixKey: string, paymentDescription: string, merchantName: string, merchantCity: string, txId: string, amount: string }){
        this.pixKey = pixKey
        this.paymentDescription = paymentDescription
        this.merchantName = merchantName
        this.merchantCity = merchantCity
        this.txId = txId
        this.amount = amount
    }

    // Método responsável por retornar um valor completo do payload
    private getValue(id: string, value: string): string{
        let size = String(value.length).padStart(2, "0")
        return id + size + value;
    }


    // Método responsável por retornar os valores da conta
    private getMerchantAccountInformation(): string{
        // Dominio do banco
        let gui = this.getValue(Payload.ID_MERCHANT_ACCOUNT_INFORMATION_GUI, "br.gov.bcb.pix")
        // Chave pix
        let key = this.getValue(Payload.ID_MERCHANT_ACCOUNT_INFORMATION_KEY, this.pixKey)
        // Descrição do pagamento
        let description = this.paymentDescription ? this.getValue(Payload.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, this.paymentDescription) : ""

        // Dados completos da conta
        let completData: string = this.getValue(Payload.ID_MERCHANT_ACCOUNT_INFORMATION, gui + key + description)

        return completData
    } 


    // Método responsável por retornar os valores completos do campo adicional do Pix (TxId)
    private getAdditionalDataFieldTemplate(): string{
        let txId: string = this.getValue(Payload.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.txId)

        return this.getValue(Payload.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txId)
    }

    private getCRC16(payload: string) {
        //ADICIONA DADOS GERAIS NO PAYLOAD
        payload += Payload.ID_CRC16 + '04';
  
        //DADOS DEFINIDOS PELO BACEN
        let polinomio = 0x1021;
        let resultado = 0xFFFF;
  
        //CHECKSUM
        if ((length = payload.length) > 0) {
            for (let i = 0; i < length; i++) {
              resultado ^= payload[i].charCodeAt(0) << 8;
              for (let bitwise = 0; bitwise < 8; bitwise++) {
                if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
                resultado &= 0xffff;
              }
            }
          }
  
        //RETORNA CÓDIGO CRC16 DE 4 CARACTERES
        return Payload.ID_CRC16 + '04' + resultado.toString(16).toUpperCase();
    }

    // Método responsável por gerar o código completo do payload Pix
    public getPayload(): string{
        let payload: string = this.getValue(Payload.ID_PAYLOAD_FORMAT_INDICATOR, "01")
                                    + this.getMerchantAccountInformation()
                                    + this.getValue(Payload.ID_MERCHANT_CATEGORY_CODE, "0000")
                                    + this.getValue(Payload.ID_TRANSACTION_CURRENCY, "986")
                                    + this.getValue(Payload.ID_TRANSACTION_AMOUNT, this.amount)
                                    + this.getValue(Payload.ID_COUNTRY_CODE, "BR")
                                    + this.getValue(Payload.ID_MERCHANT_NAME, this.merchantName)
                                    + this.getValue(Payload.ID_MERCHANT_CITY, this.merchantCity)
                                    + this.getAdditionalDataFieldTemplate()

        return payload + this.getCRC16(payload)
    }

}