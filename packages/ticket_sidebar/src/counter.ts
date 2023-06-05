import zafClient from "@app/zendesk/sdk"

export async function setupCounter(element: HTMLButtonElement) {
  const getAsignee = async () => {
    const { ticket } = await zafClient.get("ticket")
    const asignee = ticket.asignee.user.name || "Someone awesome!"
    element.innerHTML = `Asignee is: ${asignee}`
  }
  element.addEventListener('click', () => getAsignee())
  getAsignee()
}
