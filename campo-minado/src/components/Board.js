import React, { useEffect, useState } from "react";
import createBoard from "../util/createBoard";
import Cell from "./Cell";
import { revealed } from "../util/reveal";
import Modal from "./Modal";
import Timer from "./Timer";


const Board = () => {
    const [ grid, setGrid ] = useState([]);
    const [ nomMineCount, setNomMineCount ] = useState(0);
    const [ mineLocation, setMineLocations ] = useState([]);
    const [ gameOver, setGameOver ] = useState(false);

    // ComponentDidMout
    useEffect(()=>{
        // Cria Board
        function freshBoard(){
            const newBoard = createBoard(20, 20, 40);
            setNomMineCount(20*20 - 40);
            setMineLocations(newBoard.mineLocation);
            setGrid(newBoard.board);
        }
        // Chamada da função
        freshBoard();
    }, []);


    const freshBoard = () => {
        const newBoard = createBoard(20, 20, 40);
        setNomMineCount(20*20 - 40);
        setMineLocations(newBoard.mineLocation);
        setGrid(newBoard.board);
    };

    const restartGame = () => {
        freshBoard();
        setGameOver(false);
    }

    // Funcao chamada ao clicar com o botao direito na celula
    const updateFlag = (e, x, y) => {
        e.preventDefault(); // Evita que seja exibido o menu dropdown ao clicar com o botao direito
        let newGrid = JSON.parse(JSON.stringify(grid));
        newGrid[x][y].flagged = true;
        setGrid(newGrid);
    }

    // Revela celula
    const revealCell = (x, y) => {
        if (grid[x][y].revealed || gameOver){
            return;
        }

        let newGrid = JSON.parse(JSON.stringify(grid));
        if (newGrid[x][y].value === 'X') {
            for (let i = 0; i < mineLocation.length; i++){
                newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
            }

            setGrid(newGrid);
            setGameOver(true);
        } else {
            //if (newGrid[x][y].revealed == false){
                let newRevealedBoard = revealed(newGrid, x, y, nomMineCount);
                setNomMineCount(newRevealedBoard.newNonMinesCount);
                setGrid(newRevealedBoard.arr);

                if (newRevealedBoard.newNonMinesCount === 0) {
                    setGameOver(true);
                }
            //}
        }

    }

    return (
        <div>
            {/* <p> Minesweeper </p> */}
            {/* <Timer /> */}
            <div
                style={{
                    display : 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
            {gameOver && <Modal restartGame={restartGame}/>}
            {grid.map((singleRow, index1) =>{
            return (
                <div style={{display : "flex"}} key={index1}>
                    {singleRow.map((eachBlock, index2) => {
                        return (
                            <Cell
                                details={eachBlock}
                                updateFlag={updateFlag}
                                revealCell={revealCell}
                                key={index2}/>
                        );
                    })}
                </div>
            )
        })}
            </div>


        </div>
    )
}

export default Board;