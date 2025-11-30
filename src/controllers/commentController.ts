import { Request, Response } from "express";
import Comment from "../models/Comment";

export const createComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { movieId, text } = req.body;
    const userId = (req as any).userId;

    if (!text || !movieId) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    const comment = await Comment.create({ userId, movieId, text });
    return res.status(201).json(comment);
  } catch (error) {
    console.error("❌ Error al crear el comentario:", error);
    return res.status(500).json({
      message: "Error al crear el comentario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCommentsByMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { movieId } = req.params;
    const comments = await Comment.find({ movieId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    return res.status(500).json({
      message: "Error al obtener comentarios",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const updateComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = (req as any).userId;

    const comment = await Comment.findOneAndUpdate(
      { _id: id, userId },
      { text, updatedAt: new Date() },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comentario no encontrado o no autorizado",
      });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error("❌ Error al actualizar comentario:", error);
    return res.status(500).json({
      message: "Error al actualizar comentario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const comment = await Comment.findOneAndDelete({ _id: id, userId });

    if (!comment) {
      return res.status(404).json({
        message: "Comentario no encontrado o no autorizado",
      });
    }

    return res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar comentario:", error);
    return res.status(500).json({
      message: "Error al eliminar comentario",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getCommentsByMovieId = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { movieId } = req.params;

    const comments = await Comment.find({ movieId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay comentarios para esta película." });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.error("❌ Error al obtener los comentarios:", error);
    return res.status(500).json({
      message: "Error al obtener comentarios",
      error: error instanceof Error ? error.message : error,
    });
  }
};
