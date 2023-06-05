import zafClient from "@app/zendesk/sdk"

const MINIMUM_ORDER_ID_LENGTH = 5

type Ticket = {
    id: number,
}

type hasGreaterFn = (len: number) => (str: string) => boolean
const hasLengthGreaterOrEqualThan: hasGreaterFn = (len: number) => (str: string) => str.length >= len

const hasLengthGreaterThanN = hasLengthGreaterOrEqualThan(MINIMUM_ORDER_ID_LENGTH)

export async function init() {
  function showError(error: Error) {
      console.log("Errores Request", error)
  }

  zafClient.on('ticket.custom_field_360017010219.changed', async function(order_id) {
      console.log("Se ha modificado el pedido", order_id);
        const ticket: Ticket = await zafClient.get("ticket")
        const ticket_id = ticket.id

      if (order_id && hasLengthGreaterThanN(order_id)) {
          console.log("Order id identificado: ", order_id)
          const settings = {
              url: 'http://34.110.237.158/zendesk-hook',
              type:'POST',
              contentType: 'application/json',
              data: JSON.stringify( {order_id, ticket_id, acmofy: true} )
          };

          zafClient.request(settings).then(
              function(data) {
                  console.log("Request Executed", data)
              },
              function(response) {
                  showError(response);
              }
          );
      }
  });
}
