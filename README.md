# Todo application/spring JS cources
Requirements
The app should provide an API consisting of operations listed below:

Create new TODO item.

It should be possible to add a new TODO item by running following command

   todos create
Then it should be prompted to the user to input TODO title and description.

As soon as all required data was inputted, new todo item should be written to file and it's id should be printed to console.

Read TODO item.

It should be possible to read TODO item using following command:

    todos read <id>
Target TODO item should be printed to console in JSON format. In case TODO item doesn't exists, then following error message should be printed to console "TODO item not found".

Update existing TODO item.

It should be possible to update TODO item using following command:

    todos update <id>
Then it should be prompted to the user to input new TODO title and description.

As soon as all required data was inputted, todo item should be updated in file and it's id should be printed to console.

Remove TODO item.

It should be possible to remove TODO item using following command:

    todos remove <id>
In case of successful execution TODO item should be removed from the file, removed items count should be printed to console.

List all TODO items.

It should be possible to list all available TODO items using following command:

    todos list
TODOs list in JSON format should be printed.

Like TODO item.

It should be possible to mark TODO item as liked using following command:

    todos like <id>
Actual liked status should be printed to console.

Unlike TODO item.

It should be possible to remove liked mark using following command:

    todos unlike <id>
Actual liked status should be printed to console.

Add comment for TODO item.

It should be possible to comment todo item using following command

    todos comment <id>
Then it should be prompted to the user to input comment text.

As soon text was inputted, new comment should be added to file, target TODO item's id should be printed to console.
