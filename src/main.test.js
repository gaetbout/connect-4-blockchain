beforeAll(async function () {
  // NOTE: nearlib and nearConfig are made available by near-cli/test_environment
  const near = await nearlib.connect(nearConfig)
  window.accountId = nearConfig.contractName
  window.contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['isInGame', 'getGameCoordinates'],
    changeMethods: ['createGame', 'playAtColumn', 'deleteGame'],
    sender: window.accountId
  })
})
//More tests on backend 

test('createGame isInGame', async () => {
  await window.contract.createGame({ accountId: window.accountId })
  const message = await window.contract.isInGame({ accountId: window.accountId })
  expect(message).toBeTruthy()
})

test('deleteGame isInGame', async () => {
  await window.contract.deleteGame({ accountId: window.accountId })
  const message = await window.contract.isInGame({ accountId: window.accountId })
  expect(message).toBeFalsy()
})

test('playAtColumn getGameCoordinates', async () => {
  await window.contract.createGame({ accountId: window.accountId })
  await window.contract.playAtColumn({ columnString: '0', accountId: window.accountId })
  let board = JSON.parse(await window.contract.getGameCoordinates({ accountId: window.accountId }))
  expect(board.gameState).toBe("PLAYING")
  expect(board.coordinates.playerCoords[0].toString()).toBe("0,0")
  expect(board.coordinates.aiCoords.length).toBe(1)// Since AI plays at random spot we cannot predict where it'll play
  expect(board.possibleMoves.toString()).toBe("0,1,2,3,4,5,6")
})
