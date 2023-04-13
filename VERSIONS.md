# VERSIONS.md

## 0.1.0

### 0.1.0.20230330.1

1. init version

### 0.1.0.20230403.1

1. add query balance command, eg:`npx ts-node ./src/main.ts cash-tools balance 0x000....`

### 0.1.0.20230410.1

1. add transfer command, eg:`npx ts-node ./src/main.ts cash-tools transfer-eth 100 --from 0 --to 1`

### 0.1.0.20230411.1

1. support transfer path command, eg:`npx ts-node ./src/main.ts cash-tools transfer-path 0.1 --transfer-path 0,1`

### 0.1.0.20230413.1

1. optimize transfer log format
2. fix the problem that the minimum amount in the `transfer-eth` command cannot be less than the gas cost
3. add transaction confirmation prompt
