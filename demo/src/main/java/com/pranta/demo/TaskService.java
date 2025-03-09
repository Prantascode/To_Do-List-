package com.pranta.demo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }
    public Task addTask(Task task){
        return taskRepository.save(task);
    }
    public void deleteTask(Long id){
        taskRepository.deleteById(id);
    }
    public Task updateTask(Long id, Task task){
        Task existingTask = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        existingTask.setTitle(task.getTitle());
        existingTask.setCompleted(task.isCompleted());
        return taskRepository.save(existingTask);
    }
}
