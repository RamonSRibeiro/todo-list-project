// Rota para deletar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    res.json({ success: true, message: 'Tarefa deletada com sucesso', changes: result.changes });
  } catch (err) {
    console.error('Erro ao deletar a tarefa:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});
