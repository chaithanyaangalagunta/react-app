const initialiseEventHandlers = (client) => {
  console.log("Initialising event handlers", client.events.enums.TASK_UPDATE);
  client.events.on(
    client.events.enums.TASK_UPDATE,
    async (event) => {
      try {
        console.log("Task updated", event);
        const result = await client.interface.show("dialog", {
          title: "Updating a task, blocking from marketplace app",
          content: `Are you sure you want to update this task?`,
        });
        console.log({ event, result });
        if (result) {
          console.log("resolved", event);
          event?.resolve();
        } else {
          console.log("rejected", event);
          event?.reject("User cancelled");
        }
      } catch (error) {
        console.error("Error updating task", error);
        event?.reject("Error updating task");
      }
    },
    { intercept: true }
  );
  client.events.on(
    client.events.enums.TASK_CREATE,
    async (event) => {
      try {
        console.log("Task created", event);
        const result = await client.interface.show("dialog", {
          title: "Creating a task, blocking from marketplace app",
          content: `Are you sure you want to create this task?`,
        });
        console.log({ event, result });
        if (result) {
          console.log("resolved", event);
          event?.resolve();
        } else {
          console.log("rejected", event);
          event?.reject("User cancelled");
        }
      } catch (error) {
        console.error("Error creating task", error);
        event?.reject("Error creating task");
      }
    },
    { intercept: true }
  );
  client.events.on(
    client.events.enums.TASK_DELETE,
    async (event) => {
      try {
        console.log("Task deleted", event);
        const result = await client.interface.show("dialog", {
          title: "Deleting a task, blocking from marketplace app",
          content: `Are you sure you want to delete this task?`,
        });
        console.log({ event, result });
        if (result) {
          console.log("resolved", event);
          event?.resolve();
        } else {
          console.log("rejected", event);
          event?.reject("User cancelled");
        }
      } catch (error) {
        console.error("Error creating task", error);
        event?.reject("Error creating task");
      }
    },
    // { intercept: true }
  );
};

window.initialiseEventHandlers = initialiseEventHandlers;

if (window.rliSdk) {
  window.rliSdk.init().then((client) => {
    console.log("Client initialised", client);
    initialiseEventHandlers(client);
  });
}
